const storyIndexGenerator = require('./lib/story-index-generator')
const testGenerator = require('./lib/test-generator')

module.exports.generateStoryIndex = storyIndexGenerator.generateStoryIndex
module.exports.generateTestIndex = storyIndexGenerator.generateTestIndex
module.exports.testGenerator = testGenerator.testGenerator
