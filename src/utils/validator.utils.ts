import Joi, { ObjectSchema } from 'joi'

export class Validator {
  static Validate<T>(schema: ObjectSchema<T>, data: T): T {
    const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true })
    if (error) {
      throw new Error(error.details.map((e) => e.message).join(', '))
    }
    return value
  }
}
