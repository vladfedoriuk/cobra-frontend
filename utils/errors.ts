export const handleFieldsErrors = <
  FieldsType extends string,
  ResponseErrorsDataType = Record<FieldsType, unknown>
>(
  responseErrorsData: ResponseErrorsDataType,
  onFieldError: (fieldName: FieldsType, fieldError: string) => void = null,
  ...fields: Array<FieldsType>
): void => {
  const fieldsArray = new Array<FieldsType>(...fields)
  fieldsArray.forEach((fieldName, _) => {
    const fieldErrorHandler = (message) => onFieldError(fieldName, message)
    if (fieldName in responseErrorsData) {
      handleSingleKeyError<ResponseErrorsDataType>(
        responseErrorsData,
        fieldName,
        fieldErrorHandler
      )
      handleDetailError<ResponseErrorsDataType>(
        responseErrorsData[fieldName as string],
        fieldErrorHandler
      )
    }
  })
}

export const handleProjectInvitationErrors = <ResponseErrorsDataType>(
  responseErrorsData: ResponseErrorsDataType,
  onDetailError: (detail: string) => void = null
): void => {
  handleSingleKeyError(
    responseErrorsData,
    'pending_invitation_already_exists',
    onDetailError
  )
  handleSingleKeyError(
    responseErrorsData,
    'user_is_already_a_member',
    onDetailError
  )
  handleSingleKeyError(
    responseErrorsData,
    'inviter_is_not_a_maintainer_or_a_creator',
    onDetailError
  )
}

export const handleDetailError = <ResponseErrorsDataType>(
  responseErrorsData: ResponseErrorsDataType,
  onDetailError: (detail: string) => void = null
): void => handleSingleKeyError(responseErrorsData, 'detail', onDetailError)

export const handleListErrors = <ResponseErrorsDataType>(
  responseErrorsData: ResponseErrorsDataType,
  onListError: (message: string) => void = null
): void => {
  if (Array.isArray(responseErrorsData)) {
    responseErrorsData.forEach((message, _) => {
      if (typeof message === 'string') {
        onListError(message)
      }
    })
  }
}

export const handleSingleKeyError = <ResponseErrorsDataType>(
  responseErrorsData: ResponseErrorsDataType,
  key: string,
  onKeyError: (message: string) => void = null
): void => {
  let message
  if (key in responseErrorsData && onKeyError !== null) {
    message = responseErrorsData[key]
    if (Array.isArray(message)) {
      message = message[0]
    }
    if (message && typeof message === 'string') {
      onKeyError(message)
    }
  }
}
