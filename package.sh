#!/bin/bash

# Define the output file name
OUTPUT_FILE="fistgirl.fda"

echo "Packaging FDM extension..."

# Remove the old .fda file if it exists so we start fresh
if [ -f "$OUTPUT_FILE" ]; then
    rm "$OUTPUT_FILE"
    echo "Removed old $OUTPUT_FILE"
fi

# Navigate into the add-on directory
cd add-on || { echo "Error: add-on directory not found"; exit 1; }

# Zip all contents of the add-on folder and place the archive in the parent directory
zip -r "../$OUTPUT_FILE" *

# Go back to the parent directory
cd ..

echo "======================================"
echo "Success! Created $OUTPUT_FILE"
echo "======================================"