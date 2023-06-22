const rootStyles = window.getComputedStyle(document.documentElement)

if(rootStyles.getPropertyValue('--image-cover-width') != null && rootStyles.getPropertyValue('--image-cover-width') != '') {
    ready()
}else {
    document.getElementById('main-css').addEventListener('load', ready)
}
function ready() {
    const coverWidth = parseFloat(rootStyles.getPropertyValue('--image-cover-width'))
    const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--image-cover-aspect-ratio'))
    const coverHeight = coverWidth / coverAspectRatio

    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode
    )

    FilePond.setOptions({
        stylePanelAspectRatio: 1 / coverAspectRatio,
        imageResizeTargetWidth: coverWidth,
        imageResizeTargetHeight: coverHeight
    })

    FilePond.parse(document.body)
}