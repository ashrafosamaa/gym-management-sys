import { paginationFunction } from "./pagination"

export class APIFeatures {
    query: any
    mongooseQuery: any
    constructor(query: any, mongooseQuery: any) {
        this.query = query
        this.mongooseQuery = mongooseQuery
    }

    pagination({ page, size }: { page: number; size: number }) {
    //  Get all data paginated
        const { limit, skip } = paginationFunction({ page, size })
        this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip)
        return this
    }

    sort(sortBy: any) {
        if (!sortBy) {
            this.mongooseQuery = this.mongooseQuery.sort({ createdAt: -1 })
            return this
        }
        const formula = sortBy.replace(/desc/g, -1).replace(/asc/g, 1).replace(/ /g, ':') 
        const [key, value] = formula.split(':')
        this.mongooseQuery = this.mongooseQuery.sort({ [key]: +value })
        return this
    }

    // Search on users by firstName, lastName, email, phoneNumber
    searchUsers(search: any) {
        const queryFiler: any = {}
        if (search.firstName) queryFiler.firstName = { $regex: search.firstName, $options: 'i' }
        if (search.lastName) queryFiler.lastName = { $regex: search.lastName, $options: 'i' }
        if (search.eamil) queryFiler.eamil = { $regex: search.eamil, $options: 'i' }
        if (search.phoneNumber) queryFiler.phoneNumber = { $regex: search.phoneNumber, $options: 'i' }
        this.mongooseQuery = this.mongooseQuery.find(queryFiler)
        return this
    }

    // Search on trainers by userName, specialization, phoneNumber
    searchTrainers(search: any) {
        const queryFiler: any = {}
        if (search.userName) queryFiler.userName = { $regex: search.userName, $options: 'i' }
        if (search.specialization) queryFiler.specialization = { $regex: search.specialization, $options: 'i' }
        if (search.phoneNumber) queryFiler.phoneNumber = { $regex: search.phoneNumber, $options: 'i' }
        if (search.experience) queryFiler.experience = { $regex: search.experience, $options: 'i' }
        this.mongooseQuery = this.mongooseQuery.find(queryFiler)
        return this
    }

}
