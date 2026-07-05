var msParser = (function()
{
    // Support the project: https://ko-fi.com/sagarchaulagain
    function MsParser()
    {
    }

    MsParser.prototype = {
        
        parse: function (obj)
        {
            var url = String(obj.url);
            console.log("FDM msParser: Starting parse for URL: " + url);

            var cookiesStr = "";
            if (Array.isArray(obj.cookies)) {
                cookiesStr = obj.cookies.map(function(c) { return c.name + "=" + c.value; }).join("\n");
            } else if (typeof obj.cookies === "string") {
                cookiesStr = obj.cookies;
            }

            var self = this;
            self._cookiesStr = cookiesStr;
            return new Promise(function(resolve, reject)
            {
                try
                {
                    // Extract direct download link from fuckingfast.co URL
                    self.extractFuckingFastDirectLink(url)
                        .then(function (directLink) {
                            console.log("FDM msParser: Successfully extracted direct link: " + directLink.substring(0, 50) + "...");

                            var title = self.getFileNameFromUrl(url);
                            if (!title || title.length === 0) {
                                title = "download";
                            }

                            // Always extract extension for FDM, but handle filename carefully
                            var fileExtension = self.getFileExtension(url) || 'bin';
                            var hasExtension = title.match(/\.[a-zA-Z0-9]{1,10}$/);
                            
                            // If title already has extension, remove it to prevent duplication
                            // FDM will add the extension from the ext field
                            var cleanTitle = title;
                            if (hasExtension && fileExtension) {
                                // Remove the extension from title since FDM will add it from ext field
                                cleanTitle = title.replace(/\.[a-zA-Z0-9]{1,10}$/, '');
                            }
                            
                            console.log("FDM msParser: Original title: " + title + ", clean title: " + cleanTitle + ", ext: " + fileExtension);
                            
                            // Return single media format - always include ext field for FDM
                            var formatObj = {
                                url: directLink,
                                protocol: directLink.startsWith('https://') ? 'https' : 'http',
                                ext: fileExtension,
                                format_id: 'direct_download'
                            };
                            
                            var result = {
                                title: cleanTitle,
                                webpage_url: url,
                                formats: [formatObj]
                            };

                            resolve(result);
                        })
                        .catch(function (error) {
                            console.log("FDM msParser: Failed to extract direct link: " + error);
                            reject({ error: "Failed to extract direct download link: " + error, isParseError: true });
                        });
                }
                catch (e)
                {
                    console.log("FDM msParser: Parse error: " + e.message);
                    reject({error: e.message, isParseError: true});
                }
            });
        },

        isSupportedSource: function(url)
        {
            // Support fuckingfast.co and dl.fuckingfast.co pages (but not direct /dl/ URLs to prevent recursion)
            return /^https:\/\/(?:dl\.)?fuckingfast\.co\/.+/.test(url) && !/\/dl\//.test(url);
        },

        supportedSourceCheckPriority: function()
        {
            return 0x7FFFFFFF - 1; // Slightly lower priority than playlist parser
        },

        isPossiblySupportedSource: function(obj)
        {
            return false;
        },

        minIntevalBetweenQueryInfoDownloads: function()
        {
            return 500; // 500ms between individual downloads
        },

        // Helper methods
        extractFuckingFastDirectLink: function (fuckingFastUrl, cookiesStr) {
            console.log("FDM Plugin: extractFuckingFastDirectLink called with: " + fuckingFastUrl);

            return new Promise(function (resolve, reject) {
                var getHeaders = [
                    { key: "User-Agent", value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
                    { key: "Accept", value: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8" }
                ];

                var safeCookies = cookiesStr || "";

                // Enhanced Fallback Using Exact Qt/QML Bridge Syntax
                function executePattern4WithPython() {
                    console.log("FDM msParser: Executing Pattern 4 via Native Python Bridge...");
                    
                    if (typeof launchPythonScript !== "function") {
                        reject("Pattern 4 failed: launchPythonScript engine method is not available in this FDM sandbox version.");
                        return;
                    }

                    // FIX: launchPythonScript expects: (requestId, interactive, scriptPath, args)
                    launchPythonScript(0, true, "extractor.py", [fuckingFastUrl, safeCookies])
                        .then(function(result) {
                            console.log("FDM msParser: Python process completed execution.");
                            
                            // FIX: FDM resolves process streams to the .output property
                            var output = (result && result.output) ? result.output.trim() : "";
                            
                            if (output.indexOf("SUCCESS:") === 0) {
                                var directLink = output.substring(8);
                                console.log("FDM msParser: Python successfully bypassed Cloudflare! Link: " + directLink);
                                resolve(directLink);
                            } else if (output.indexOf("ERROR:") === 0) {
                                reject("Python script execution error: " + output.substring(6));
                            } else {
                                reject("Pattern 4 failed: Unexpected console footprint returned from script: " + output);
                            }
                        })
                        .catch(function(err) {
                            var errorDetails = typeof err === 'object' ? JSON.stringify(err) : err;
                            reject("Pattern 4 Python runtime failure: " + errorDetails);
                        });
                }

                // Step 1: Standard HTML parsing pass-through
                downloadUrlAsUtf8Text(fuckingFastUrl, safeCookies, getHeaders, "")
                    .then(function (response) {
                        console.log("FDM Plugin: Received HTML response from fuckingfast.co");
                        if (!response) {
                            executePattern4WithPython();
                            return;
                        }

                        try {
                            var body = response.body || response.text || (typeof response === 'string' ? response : "");
                            var directLink = null;

                            var m = body.match(/window\.open\(\s*["'](https?:\/\/(?:dl\.)?fuckingfast\.co\/dl\/[^"']+)["']/);
                            if (m) { directLink = m[1]; }

                            if (!directLink) {
                                m = body.match(/href=["'](https?:\/\/(?:dl\.)?fuckingfast\.co\/dl\/[^"']+)["']/);
                                if (m) { directLink = m[1]; }
                            }

                            if (!directLink) {
                                m = body.match(/(https?:\/\/(?:dl\.)?fuckingfast\.co\/dl\/[^\s"'<>]+)/);
                                if (m) { directLink = m[1]; }
                            }

                            if (directLink) {
                                console.log("FDM msParser: Found link instantly via Patterns 1-3.");
                                resolve(directLink);
                            } else {
                                console.log("FDM msParser: Patterns 1-3 found nothing in HTML. Routing to Python...");
                                executePattern4WithPython();
                            }
                        } catch (e) {
                            console.log("FDM msParser: Error parsing HTML response: " + e + ". Routing to Python...");
                            executePattern4WithPython();
                        }
                    })
                    .catch(function (err) {
                        console.log("FDM Plugin: HTML fetch failed. Routing to Python...");
                        executePattern4WithPython();
                    });
            });
        },

        getFileNameFromUrl: function (url) {
            try {
                if (!url || typeof url !== 'string') {
                    return "download";
                }

                var filename = "download";
                var hashIndex = url.indexOf('#');
                if (hashIndex !== -1) {
                    filename = url.substring(hashIndex + 1);
                } else {
                    // Try to extract from URL path
                    var pathMatch = url.match(/\/([^\/\?#]+)(?:\?|#|$)/);
                    if (pathMatch && pathMatch[1]) {
                        filename = pathMatch[1];
                    }
                }

                try {
                    filename = decodeURIComponent(filename);
                } catch (decodeError) {
                    // Use as-is if decode fails
                }

                // Clean filename
                filename = filename.replace(/[<>:"\/\\|?*]/g, '_');

                // Log the extracted filename for debugging
                console.log("FDM msParser: Extracted filename: " + filename);

                if (!filename || filename.length === 0) {
                    filename = "download";
                } else if (filename.length > 255) {
                    filename = filename.substring(0, 255);
                }

                return filename;
            } catch (e) {
                console.log("FDM msParser: Error in getFileNameFromUrl: " + e);
                return "download";
            }
        },

        getFileExtension: function (url) {
            try {
                if (!url || typeof url !== 'string') {
                    return null;
                }

                // Extract from hash part (filename after #)
                var hashIndex = url.indexOf('#');
                if (hashIndex !== -1) {
                    var filename = url.substring(hashIndex + 1);
                    
                    // Handle multi-part files properly - look for the actual file extension
                    // e.g., "file.part1.rar" should return "rar", not "part1"
                    var extensionMatch = filename.match(/\.([a-zA-Z0-9]{1,10})$/);
                    if (extensionMatch) {
                        var ext = extensionMatch[1].toLowerCase();
                        console.log("FDM msParser: Detected file extension: " + ext + " from filename: " + filename);
                        return ext;
                    }
                    
                    // Fallback: look for any extension pattern
                    var fallbackMatch = filename.match(/\.([a-zA-Z0-9]{1,10})(?:\.|$)/);
                    if (fallbackMatch) {
                        return fallbackMatch[1].toLowerCase();
                    }
                }

                // Fallback: try to extract from URL path
                var match = url.match(/\.([a-zA-Z0-9]{1,10})(?:\?|#|$)/);
                return match ? match[1].toLowerCase() : null;
            } catch (e) {
                console.log("FDM msParser: Error getting file extension: " + e);
                return null;
            }
        }
    };

    return new MsParser();
}());

// Export the parser
msParser = msParser;