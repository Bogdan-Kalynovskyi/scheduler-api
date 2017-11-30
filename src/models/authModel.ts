export class Auth {

  static getUser(request): User {
    if (request.session) {
      return request.session.user
    }
    throw HttpError[401]
  }

  static isAdmin(request): boolean {
    if (request.session) {
      return request.session.isAdmin
    }
    throw HttpError[403]
  }
}