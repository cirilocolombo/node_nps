import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../repositories/UserRepository'
import * as yup from 'yup'
import { AppError } from '../errors/AppError'

class UserController {
  async create(req: Request, res: Response) {
    const { name, email } = req.body

    const schema = yup.object().shape({
      name: yup.string().required("Nome é obrigatório"),
      email: yup.string().email("Email inválido").required("Email é obrigatório"),
    })

    try {
      await schema.validate(req.body, { abortEarly: false })
    } catch(err) {
      throw new AppError(err)
    }

    const userRepository = getCustomRepository(UserRepository)

    const user = userRepository.create({ name, email })

    const userAlreadyExists = await userRepository.findOne({ email })

    if (userAlreadyExists) {
      throw new AppError("User already exists")
    }

    await userRepository.save(user)

    return res.status(201).json(user)
  }

  async show(req: Request, res: Response) {
    const userRepository = getCustomRepository(UserRepository)

    const allUsers = await userRepository.find()

    return res.status(200).json(allUsers)
  }
}

export { UserController }