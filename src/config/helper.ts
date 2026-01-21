import _ from "lodash";

export class ConfigHelper {
  private static Truth = [true, "true", "yes", "ok"];

  static parseBoolean(value: string | undefined, defaultValue = false) {
    if (_.isUndefined(value)) {
      return defaultValue;
    }
    return _.includes(ConfigHelper.Truth, String(value).trim().toLowerCase());
  }

  static parseNumber(value: string | undefined, defaultValue = 0) {
    if (_.isUndefined(value)) {
      return defaultValue;
    }
    return Number(value?.replace(/,/, "")) || defaultValue;
  }

  static parseString(value: unknown, defaultValue = "") {
    return _.isUndefined(value) ? defaultValue : _.trim(value as string);
  }
}
