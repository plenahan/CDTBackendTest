FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
)

FilePond.setOptions({
    stylePanelAspectRatio: 100 / 150,
    imageResizeTargetWidth: 150,
    imageResizeTargetHeight: 100
})

FilePond.parse(document.body)