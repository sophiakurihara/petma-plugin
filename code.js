// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(500, 500);
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (pluginMessage) => __awaiter(this, void 0, void 0, function* () {
    // One way of distinguishing between different types of messages sent froms
    // your HTML page is to use an object with a "type" property like this.
    yield figma.loadFontAsync({ family: "Rubik", style: "Regular" });
    const nodes = [];
    // pull post component set
    let postComponentSet = figma.root.findOne(node => node.type == "COMPONENT_SET" && node.name == "post");
    let postTemplate;
    if (pluginMessage.darkModeState === true) {
        if (pluginMessage.imageVariant === "1") {
            postTemplate = postComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Image=none, Dark mode=true");
        }
        else if (pluginMessage.imageVariant === "2") {
            postTemplate = postComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Image=single, Dark mode=true");
            console.log(postTemplate);
        }
        else if (pluginMessage.imageVariant === "3") {
            postTemplate = postComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Image=carousel, Dark mode=true");
        }
    }
    else {
        if (pluginMessage.imageVariant === "1") {
            postTemplate = postComponentSet.defaultVariant;
        }
        else if (pluginMessage.imageVariant === "2") {
            postTemplate = postComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Image=single, Dark mode=false");
        }
        else if (pluginMessage.imageVariant === "3") {
            postTemplate = postComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Image=carousel, Dark mode=false");
        }
    }
    console.log(typeof pluginMessage.darkModeState);
    console.log(typeof postTemplate);
    // create an instance of the selected post template
    let newPost = postTemplate.createInstance();
    let templateName = newPost.findOne(node => node.name === "displayName" && node.type === "TEXT");
    let templateUsername = newPost.findOne(node => node.name === "@username" && node.type === "TEXT");
    let templateContent = newPost.findOne(node => node.name === "description" && node.type === "TEXT");
    let numLikes = newPost.findOne(node => node.name === "likesLabel" && node.type === "TEXT");
    let numComments = newPost.findOne(node => node.name === "commentsLabel" && node.type === "TEXT");
    // if finding these children by array position, how is index determined?
    if ((templateName.type !== "TEXT" && templateName.name !== "displayName") ||
        (templateUsername.type !== "TEXT" && templateUsername.name !== "username") ||
        (templateContent.type !== "TEXT" && templateContent.name !== "description")) {
        figma.closePlugin("unexpected child");
        return;
    }
    templateName.characters = (pluginMessage === null || pluginMessage === void 0 ? void 0 : pluginMessage.name) || '';
    templateUsername.characters = (pluginMessage === null || pluginMessage === void 0 ? void 0 : pluginMessage.username) || '';
    templateContent.characters = (pluginMessage === null || pluginMessage === void 0 ? void 0 : pluginMessage.body) || '';
    numLikes.characters = (Math.floor(Math.random() * 1000) + 1).toString();
    numComments.characters = (Math.floor(Math.random() * 1000) + 1).toString();
    // TODO: Use JS dateTime function to get current date and time for tweet
    nodes.push(newPost);
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
});
