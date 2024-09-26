const { Plugin, TFolder } = require('obsidian');  // Import TFolder properly
const { exec } = require('child_process');
const path = require('path'); // Use Node's path module to get the absolute path

module.exports = class OpenInVSCodePlugin extends Plugin {
    onload() {
        // Register the event to modify the context menu for folders
        this.registerEvent(
            this.app.workspace.on('file-menu', (menu, file) => {
                // Check if the clicked item is a folder (TFolder)
                if (file instanceof TFolder) {
                    menu.addItem((item) => {
                        item.setTitle('Open in VSCode')
                            .setIcon('code')
                            .onClick(() => {
                                const absoluteFolderPath = this.getAbsoluteFolderPath(file.path);
                                this.openInVSCode(absoluteFolderPath); // Pass absolute folder path to VSCode
                            });
                    });
                }
            })
        );
    }

    // Function to resolve the full absolute path of the folder
    getAbsoluteFolderPath(folderPath) {
        return path.resolve(this.app.vault.adapter.basePath, folderPath); // Combine the vault path and folder path
    }

    // Function to open the folder in VSCode using system's full path to the 'code' command
    openInVSCode(folderPath) {
        const command = `"/usr/local/bin/code" "${folderPath}"`; // Use the full path to 'code' and absolute folder path
        exec(command, (error) => {
            if (error) {
                console.error(`Error opening folder in VSCode: ${error}`);
            } else {
                console.log(`Opened ${folderPath} in VSCode`);
            }
        });
    }

    onunload() {
        console.log('OpenInVSCodePlugin unloaded');
    }
};
