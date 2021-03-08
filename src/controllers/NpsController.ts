import { Request, Response } from "express"
import { getCustomRepository, Not, IsNull } from "typeorm"
import { SurveyUserRepository } from "../repositories/SurveyUserRepository"

class NpsController {
  async execute(req: Request, res: Response) {
    const { survey_id } = req.params

    const surveyUserRepository = getCustomRepository(SurveyUserRepository)

    const surveyUsers = await surveyUserRepository.find({
      survey_id,
      value: Not(IsNull())
    })

    const detractors = surveyUsers.filter(
      survey => (survey.value >= 0 && survey.value <= 6)
    ).length

    const passives = surveyUsers.filter(
      survey => (survey.value >= 7 && survey.value <= 8)
    ).length

    const promotors = surveyUsers.filter(
      survey => (survey.value >= 9 && survey.value <= 10)
    ).length

    const totalAnswers = surveyUsers.length

    const calc = Number((((promotors - detractors) / totalAnswers) * 100).toFixed(2))

    return res.status(200).json({
      detractors,
      passives,
      promotors,
      totalAnswers,
      nps: calc,
    })
  }
}

export { NpsController }