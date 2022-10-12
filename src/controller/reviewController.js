const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')
const mongoose = require('mongoose')
const validator = require('../validator/validator')


//creating review
const createReview = async function (req, res) {
    try {

        let data = req.body
        let bookId = req.params.bookId
        let { reviewedAt, rating } = data

        if (!reviewedAt) return res.status(400).send({ status: false, msg: "reviewdAt is required" })
        if (!rating) return res.status(400).send({ status: false, msg: "rating is required" })

        let isValid = mongoose.Types.ObjectId.isValid(bookId);
        if (!isValid) {
            return res.status(400).send({ status: false, message: "Id is Not Valid" })
        }
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Please enter the data in the request body to update" })
        }
        data.bookId = bookId

        let checkBookId = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!checkBookId) return res.status(404).send({ status: false, message: "Book doesn't exist" })

        if (data.reviewedBy !== undefined) {
            if (!validator.isValid(data.reviewedBy)) {
                return res.status(400).send({ status: false, message: "Name shouldn't be blank" })
            }
        }

                if (!validator.alphabetTestOfString(data.reviewedBy)) {
                    return res.status(400).send({ status: false, message: "Enter a valid name" })
                }
            

            data.reviewedAt = Date.now();

            if (data.review !== undefined) {
                if (!validator.isValid(data.review)) {
                    return res.status(400).send({ status: false, message: "Write review properly" })
                }
            }

            if (!data.rating)
                return res.status(400).send({ status: false, message: "You must give rating of this book." })

            if (typeof data.rating != 'number' || data.rating < 1 || data.rating > 5) {
                return res.status(400).send({ status: false, message: 'Rating should be a number between 1 to 5' })
            }

            const updatedBooks = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } }, { new: true })

            let createdReview = await reviewModel.create(data)
            let updatedBooksdata = { updatedBooks }

            updatedBooksdata.reviewsData = createdReview
            return res.status(201).send({ status: true, message: 'Success', data: updatedBooksdata })
        }
    
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//updating reviews by book Id
const updatereviewbookbybookid = async function (req, res) {

    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, msg: "Bookid is not valid" })
        if (!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, msg: "reviewid is not valid" })

        let { review, rating, reviewedBy } = req.body

        let bookData = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookData) return res.status(404).send({ status: false, msg: "Book might be deleted or its not present" })

        let findreviewandupdate = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false }, { reviewedBy: reviewedBy, rating: rating, review: review }, { new: true }).select({ createdAt: 0, updatedAt: 0, _id: 0 })
        if (!findreviewandupdate) return res.status(404).send({ status: false, msg: "Document not found it must be deleted or incorrect" })

        let finalData = {
            title: bookData.title, excerpt: bookData.excerpt, userId: bookData.userId,
            category: bookData.category, subcategory: bookData.subcategory, isDeleted: false, reviews: bookData.reviews,
            reviewsData: findreviewandupdate
        }
        res.status(200).send({ status: true, message: "Data updated Successfully", Data: finalData })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })

    }
}

//deleting reviews by book Id
const deletereviewbyid = async function (req, res) {

    try {
        let { bookId, reviewId } = req.params

        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, msg: "Bookid is not valid" })
        if (!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, msg: "reviewid is not valid" })

        let findreview = await reviewModel.findOne({ _id: reviewId, isDeleted: false },)
        if (!findreview) return res.status(404).send({ status: false, msg: "Review data might be deleted or it does not exist" })

        let findbook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: -1 } })
        if (!findbook) return res.status(404).send({ status: false, msg: "Book data might be deleted or it does not exist" })

        await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false }, { isDeleted: true }, { new: true })
        res.status(200).send({ status: true, message: "Data Deleted Successfully" })
    }

    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}

module.exports = { createReview, updatereviewbookbybookid, deletereviewbyid }

