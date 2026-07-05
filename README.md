<h1 align="center" style="margin-bottom: 1px;">Fistgirl</h1>
<p align="center">
  <img src="/add-on/icon.svg" alt="icon">
</p>

Fistgirl is a Free Download Manager (FDM) add-on that enables seamless downloading from FitGirl Repacks paste links[cite: 1]. This add-on automatically extracts and processes download links from `paste.fitgirl-repacks.site` URLs, making it easy to download game repacks directly through FDM[cite: 1].

## Support

If this project helps you, you can support development here:

https://ko-fi.com/sagarchaulagain

## Installation
1. Download the add-on (`fistgirl.fda`)[cite: 1]

<p align="center">
  <a href="https://github.com/Godkleb/fistgirl/raw/refs/heads/main/fistgirl.fda">
    <img src="https://img.shields.io/badge/Download-Latest%20Release-FF6B35?style=for-the-badge&logo=github" alt="Download Release">
  </a>
</p>

> ### ⚠️ Important Note Regarding Python Installation Warning
> Starting with version 1.0.1.0+, Free Download Manager will display a native security prompt during installation:
> **"Warning! Add-on requests dangerous permission: Launch Python code."**
>
> **Why is this required?**
> The download host (`fuckingfast.co`) completely hides its direct file links inside custom HTTP response headers instead of standard webpage code. FDM's core JavaScript engine automatically strips these headers away, leaving the application blind. 
> 
> To bypass this restriction without forcing you to use an untrusted third-party proxy server, this add-on uses FDM's native Python bridge to safely read the network headers right on your local machine.
> * **Automated & Sandboxed:** When you click **OK**, FDM automatically downloads and sets up its own isolated, portable Python runtime.
> * **Zero System Impact:** It **does not** install Python globally on your operating system, won't conflict with any tools you already have installed, and leaves no traces behind if you delete the add-on.

2. Open Free Download manager[cite: 1]
3. Click hamburger menu button ☰[cite: 1]
<img src="screenshots/1.png" alt="Screenshot 1">
4. Click on Add-ons[cite: 1]
<img src="screenshots/2.png" alt="Screenshot 2">
5. Click on install add-on from file.[cite: 1]
<img src="screenshots/3.png" alt="Screenshot 3">
6. Select the downloaded add-on (fistgirl.fda) and install it[cite: 1]
<img src="screenshots/4.png" alt="Screenshot 4">
8. Fistgirl FDM addon is successfully added.[cite: 1]

## Usage
1. Go to your favourite game[cite: 1]
2. Right click on `Filehoster: FuckingFast` link and copy it.[cite: 1]
<img src="screenshots/5.png" alt="Screenshot 5">
3. Copy link and paste it on fdm or click on Download with FDM[cite: 1]
<img src="screenshots/6.png" alt="Screenshot 6">
4. Wait for the add-on to process the links and select files and start downloading[cite: 1]
<img src="screenshots/7.png" alt="Screenshot 7">


## Features

- **Automatic Link Extraction**: Parses FitGirl paste URLs and extracts all download links[cite: 1]
- **Decryption Support**: Handles encrypted paste content using external decryption API[cite: 1]
- **Batch Processing**: Processes multiple download links from a single paste[cite: 1]
- **Smart Filtering**: Validates and filters URLs to ensure only valid download links are processed[cite: 1]
- **Game Title Detection**: Automatically extracts game titles from URLs for better organization[cite: 1]
- **Error Handling**: Comprehensive error handling with detailed logging[cite: 1]


## Supported URLs

This add-on supports URLs matching the pattern:

https://paste.fitgirl-repacks.site/?[parameters]#[key]

Also, only ```fuckingfast.co``` is supported for now[cite: 1]. I will add more supports if this addon get good response[cite: 1]. 

## Technical Details

### Components

- **`parser.js`**: Main parser that handles paste decryption and link extraction[cite: 1]
- **`msparser.js`**: Secondary parser for processing individual download links[cite: 1]
- **`extractor.py`**: High-performance, low-level Python bridge script used to bypass custom HTTP redirect blocks natively[cite: 1]
- **`manifest.json`**: add-on configuration and metadata[cite: 1]
- **`icon.svg`**: add-on icon[cite: 1]

### Link Processing

1. **URL Validation**: Checks if the URL matches FitGirl paste format[cite: 1]
2. **Parameter Extraction**: Extracts paste ID and decryption key from URL[cite: 1]
3. **Content Decryption**: Uses external API to decrypt paste content[cite: 1]
4. **Link Extraction**: Finds all `fuckingfast.co` download links[cite: 1]
5. **Validation & Filtering**: Validates URLs and creates download entries[cite: 1]
6. **Playlist Creation**: Organizes links into a downloadable playlist[cite: 1]

## Configuration

The add-on includes several configurable parameters:

- **Query Interval**: Minimum 300ms between downloads (configured in `minIntevalBetweenQueryInfoDownloads`)[cite: 1]
- **Response Size Limit**: 1MB limit for decrypted content to prevent memory issues[cite: 1]
- **Link Limit**: Maximum 200 links per paste to prevent overwhelming FDM[cite: 1]
- **Priority**: Highest priority (0x7FFFFFFF) for FitGirl URLs[cite: 1]

## Troubleshooting

1. **"Invalid JSON from server"**: The paste URL may be malformed or the paste may be corrupted[cite: 1]
2. **"Failed to decrypt paste"**: The decryption key in the URL may be incorrect or the external API may be unavailable[cite: 1]
3. **"No links found"**: The paste may not contain any download links or they may be in an unexpected format[cite: 1]


## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests[cite: 1].

### Development Setup

1. Clone the repository[cite: 1]
2. Make your changes to the JavaScript or Python files[cite: 1]
3. Test with FDM by copying to the add-ons directory[cite: 1]
4. Submit a pull request with your improvements[cite: 1]

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details[cite: 1].

## Disclaimer

This add-on is for educational purposes and to facilitate legitimate downloads[cite: 1]. Please respect copyright laws and only download content you have the right to access[cite: 1]. The authors are not responsible for any misuse of this software[cite: 1].
