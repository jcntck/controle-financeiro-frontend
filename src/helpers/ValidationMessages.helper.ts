export default class ValidationMessages {
  private static ERROR_MESSAGES: any = {
    minlength: ({ requiredLength }: any) =>
      `Este campo deve conter pelo menos ${requiredLength} caracteres`,
    required: () => `Este campo é obrigatório`,
  };

  static getErrorMessage(error: Object | null) {
    try {
      const [[errorName, errorInfo]] = Object.entries(error!);
      return ValidationMessages.ERROR_MESSAGES[errorName](errorInfo);
    } catch (err: any) {
      throw 'Error not implemented';
    }
  }
}
