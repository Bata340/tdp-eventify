export default class ValidationUtils {
    static isEmpty(value) {
        return value == undefined || value == null || value == '';
    }
}