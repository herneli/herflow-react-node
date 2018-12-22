import React from "react";
import { toast } from "react-toastify";
import T from "i18n-react";

export default {
  message(message, options = {}) {
    let { spinner, clear, ...restOptions } = options;

    if (clear) {
      toast.dismiss();
    }

    let finalMessage = message;
    if (spinner) {
      finalMessage = (
        <span>
          <span className="spinner" />
          {finalMessage}
        </span>
      );
    }
    if (!restOptions.type || restOptions.type === "info") {
      restOptions.className = "toast-black";
    } else {
      restOptions.className = "toast-default";
    }
    toast(finalMessage, restOptions);
  },
  info(message, options = {}) {
    options = { autoClose: 4000, ...options, type: "info" };
    this.message(message, options);
  },
  warning(message, options = {}) {
    options = { autoClose: 6000, ...options, type: "warning" };
    this.message(message, options);
  },
  error(message, options = {}) {
    options = { autoClose: 8000, ...options, type: "error" };
    this.message(message, options);
  },
  loading() {
    this.clear();
    this.message(T.translate("loading"), {
      autoClose: false,
      spinner: true,
      closeButton: false,
      closeOnClick: false,
      draggable: false
    });
  },
  saving() {
    this.clear();
    this.info(T.translate("saving"), { autoClose: false, spinner: true });
  },
  deleting() {
    this.clear();
    this.info(T.translate("deleting"), { autoClose: false, spinner: true });
  },
  reassigning() {
    this.clear();
    this.info(T.translate("reasigning"), { autoClose: false, spinner: true });
  },
  clear() {
    toast.dismiss();
  }
};
