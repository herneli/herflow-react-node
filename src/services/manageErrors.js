import toaster from "services/toaster";
import T from "i18n-react";
export default function(exc) {
  toaster.error(T.translate("unexpectedError"));
}
