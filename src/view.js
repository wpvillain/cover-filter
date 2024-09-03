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
    /// console.log('Script is running');
    
    const playButtonOverlays = document.querySelectorAll('.wp-block-cover__play-button-overlay');
    // console.log('Found overlays:', playButtonOverlays);
  
    playButtonOverlays.forEach((overlay) => {
      const button = overlay.querySelector('.wp-block-cover__play-button');
      
      if (button) {
        // console.log('Attaching click listener to:', button);
        button.addEventListener('click', function () {
          console.log('Play button clicked!');
          const videoElement = overlay.closest('.wp-block-cover').querySelector('video');
          if (videoElement) {
            videoElement.play();
            overlay.style.display = 'none';
          }
        });
      } else {
        console.log('No button found in overlay:', overlay);
      }
    });
  });
    