/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

/* eslint-disable no-console */
// console.log( 'Hello World! (from create-block-cover-filter-block block)' );
/* eslint-enable no-console */

document.addEventListener('DOMContentLoaded', function () {
    const playButtonOverlays = document.querySelectorAll('.wp-block-cover__play-button-overlay');
  
    playButtonOverlays.forEach((overlay) => {
        const button = overlay.querySelector('.wp-block-cover__play-button');
      
        if (button) {
            const playIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M8 5v14l11-7z"/></svg>';
            const pauseIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
            
            button.addEventListener('click', function () {
                const videoElement = overlay.closest('.wp-block-cover').querySelector('video');
                
                if (videoElement) {
                    if (videoElement.paused) {
                        videoElement.play();
                        button.innerHTML = pauseIcon; // Switch to pause icon
                    } else {
                        videoElement.pause();
                        button.innerHTML = playIcon;  // Switch to play icon
                    }
                }
            });
        } else {
            console.log('No button found in overlay:', overlay);
        }
    });
});
