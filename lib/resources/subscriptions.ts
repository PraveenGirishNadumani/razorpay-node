"use strict";

import { NormalizableDate, Notes, AnyPrimitiveObject, PaginatedRequestWithExtraKeys, ObjectWithNotes } from "../types";

/*
 * DOCS: https://razorpay.com/docs/subscriptions/api/
 */

import { normalizeDate, normalizeNotes } from '../utils/razorpay-utils';

export default function subscriptionsApi (api) {
  
  const BASE_URL = "/subscriptions",
        MISSING_ID_ERROR = "Subscription ID is mandatory";

  return {
    create(params: ObjectWithNotes, callback) {
      /*
       * Creates a Subscription
       *
       * @param {Object} params
       * @param {Function} callback
       *
       * @return {Promise}
       */

      let url = BASE_URL,
        { notes, ...rest } = params || {},
        data = Object.assign(rest, normalizeNotes(notes));

      return api.post(
        {
          url,
          data,
        },
        callback
      );
    },

    fetch(subscriptionId: string, callback) {
      /*
       * Fetch a Subscription given Subcription ID
       *
       * @param {String} subscriptionId
       * @param {Function} callback
       *
       * @return {Promise}
       */

      if (!subscriptionId) {
        return Promise.reject(MISSING_ID_ERROR);
      }

      let url = `${BASE_URL}/${subscriptionId}`;

      return api.get({ url }, callback);
    },

    all(params: PaginatedRequestWithExtraKeys, callback) {
      /*
       * Get all Subscriptions
       *
       * @param {Object} params
       * @param {Funtion} callback
       *
       * @return {Promise}
       */

      let { from, to, count, skip } = params,
        url = BASE_URL;

      if (from) {
        from = normalizeDate(from);
      }

      if (to) {
        to = normalizeDate(to);
      }

      count = Number(count) || 10;
      skip = Number(skip) || 0;

      return api.get(
        {
          url,
          data: {
            ...params,
            from,
            to,
            count,
            skip,
          },
        },
        callback
      );
    },

    cancel(subscriptionId: string, cancelAtCycleEnd = false, callback) {
      /*
       * Cancel a subscription given id and optional cancelAtCycleEnd
       *
       * @param {String} subscription
       * @param {Boolean} cancelAtCycleEnd
       * @param {Function} callback
       *
       * @return {Promise}
       */

      const url = `${BASE_URL}/${subscriptionId}/cancel`;

      if (!subscriptionId) {
        return Promise.reject(MISSING_ID_ERROR);
      }

      if (typeof cancelAtCycleEnd !== "boolean") {
        return Promise.reject(
          "The second parameter, Cancel at the end of cycle" +
            " should be a Boolean"
        );
      }

      return api.post(
        {
          url,
          ...(cancelAtCycleEnd && { data: { cancel_at_cycle_end: 1 } }),
        },
        callback
      );
    },

    createAddon(subscriptionId: string, params: AnyPrimitiveObject, callback) {
      /*
       * Creates addOn for a given subscription
       *
       * @param {String} subscriptionId
       * @param {Object} params
       * @param {Function} callback
       *
       * @return {Promise}
       */

      const url = `${BASE_URL}/${subscriptionId}/addons`;

      if (!subscriptionId) {
        return Promise.reject(MISSING_ID_ERROR);
      }

      return api.post(
        {
          url,
          data: { ...params },
        },
        callback
      );
    },
  };
}