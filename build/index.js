(()=>{"use strict";const e=window.React,o=window.wp.hooks,t=window.wp.compose,l=window.wp.blockEditor,a=window.wp.components,n=window.wp.element,r="cafejp/cover",c=(0,t.createHigherOrderComponent)((o=>t=>{const{attributes:r,setAttributes:c,name:i}=t;if("core/cover"!==i)return(0,e.createElement)(o,{...t});const{loopVideo:p,autoplayVideo:d,showPlayButton:s,coverImage:u}=r;return(0,e.createElement)(n.Fragment,null,(0,e.createElement)(o,{...t}),(0,e.createElement)(l.InspectorControls,null,(0,e.createElement)(a.PanelBody,{title:"Video Options",initialOpen:!0},(0,e.createElement)(a.ToggleControl,{label:"Loop Video",checked:p,onChange:e=>c({loopVideo:e})}),(0,e.createElement)(a.ToggleControl,{label:"Autoplay Video",checked:d,onChange:e=>c({autoplayVideo:e})}),(0,e.createElement)(a.ToggleControl,{label:"Show Play Button",checked:s,onChange:e=>c({showPlayButton:e})}),(0,e.createElement)(a.TextControl,{label:"Cover Image URL",value:u,onChange:e=>c({coverImage:e}),help:"This image will be used as the cover image for the video."}))))}),"withCoverControls");(0,o.addFilter)("blocks.registerBlockType",r,(function(e,o){return"core/cover"!==o?e:{...e,attributes:{...e.attributes,loopVideo:{type:"boolean",default:!1},autoplayVideo:{type:"boolean",default:!1},showPlayButton:{type:"boolean",default:!0},coverImage:{type:"string",default:""}}}})),(0,o.addFilter)("editor.BlockEdit",r,c),(0,o.addFilter)("blocks.getSaveElement",r,((o,t,l)=>{if("core/cover"!==t.name)return o;const{loopVideo:a,autoplayVideo:r,showPlayButton:c,coverImage:i}=l,p=(Array.isArray(o.props.children)?o.props.children.filter(Boolean):[]).map((e=>e&&"video"===e.type?(0,n.cloneElement)(e,{loop:a,autoPlay:r,poster:i||e.props.poster}):e)),d=c?(0,e.createElement)("div",{className:"wp-block-cover__play-button-overlay",style:{position:"absolute",zIndex:10}},(0,e.createElement)("button",{className:"wp-block-cover__play-button","aria-label":"Play Video"})):null;return(0,e.createElement)("div",{...o.props},p,d)}))})();