FilePond.registerPlugin(
    FilePondPuglinImagePreview,
    FilePondPuglinImageResize,
    FilePondPuglinFileEncode
)

// FilePond.setOptions({ // to resize images/set appropriate aspect ratio
    
// })

FilePond.parse(document.body);

//<input class ="filepond"> will be parsed as filePond objects