/* API logic (controller) */
const { Post, validate } = require('../../models/post')
const asyncMiddleware = require('../../middleware/async')

const index = asyncMiddleware (async (req, res) => {
    const posts = await Post.find()

    res.send(posts)
})

const show = asyncMiddleware (async (req, res) => {
    const post = await Post.findById(req.params.postId)
    if (!post) return post.status(404).send('The post was not found. :)')

    res.send(post)    
})

const destroy = asyncMiddleware (async (req, res) => {
    const post = await Post.findByIdAndRemove(req.params.postId)

    if (!post) return post.status(404).send('The post was not found. :)')

    res.send(post)
})

const create = asyncMiddleware (async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);
     
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        writer: req.body.writer
    })

    await post.save()

    res.send(post)
})

const update = asyncMiddleware (async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const post = await Post.findByIdAndUpdate(req.params.postId, {
        title: req.body.title,
        content: req.body.content,
    }, { new: true })

    if (!post) return post.status(404).send('The post was not found. :)')
    
    res.send(post)
})

module.exports = {
    index, show, destroy, create, update,
}