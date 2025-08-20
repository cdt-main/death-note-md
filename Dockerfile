# ✅ 1. Use official Node.js 20 LTS base image
FROM node:20

# ✅ 2. Install ffmpeg and rar, then clean up apt cache to keep image small
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# ✅ 2. Install ffmpeg and the official RAR tool, then clean up.
RUN \
    # Update package lists and install wget (to download files)
    apt-get update && \
    apt-get install -y wget ffmpeg && \
    \
    # Download the LATEST official RAR binary for Linux 64-bit
    wget https://www.rarlab.com/rar/rarlinux-x64-712.tar.gz -O rarlinux.tar.gz && \
    \
    # Extract the downloaded archive
    tar -xzvf rarlinux.tar.gz && \
    \
    # Copy the 'rar' and 'unrar' commands to a location where the system can find them
    cp rar/rar /usr/local/bin/ && \
    cp rar/unrar /usr/local/bin/ && \
    \
    # Make them executable
    chmod +x /usr/local/bin/rar && \
    chmod +x /usr/local/bin/unrar && \
    \
    # Clean up downloaded files and extracted folders to keep the image small
    rm -rf rarlinux.tar.gz rar && \
    \
    # Clean up apt cache
    rm -rf /var/lib/apt/lists/*

# ✅ 3. Set working directory inside container
WORKDIR /app

# ✅ 4. Copy only package files first (better caching)
COPY package*.json ./

# ✅ 5. Update existing npm packages
RUN npm update

# ✅ 6. Install dependencies
RUN npm install

# ✅ 7. Copy all remaining project files
COPY . .

# ✅ 8. Expose your app's port (adjust if different)
EXPOSE 3000

# ✅ 9. Run app with npm start
CMD ["npm","start"]
