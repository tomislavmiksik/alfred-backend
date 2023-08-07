/**
 * journal-entry controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::journal-entry.journal-entry', ({ strapi }) => {
  return {
    async find(ctx, next) {
      const user = ctx.state.user
      strapi.log.debug(JSON.stringify(ctx.state));
      if (!user) {
        return ctx.badRequest(null, [{ messages: [{ id: "No auth header found" }] }])
      }

      const data = await strapi.entityService.findMany("api::journal-entry.journal-entry", {
        filters: {
          "author": {
            "id": user.id
          }
        },

      });
      if (!data) {
        return ctx.notFound();
      }

      const sanitizedEvents = await this.sanitizeOutput(data, ctx);

      return this.transformResponse(sanitizedEvents);
    },
    async create(ctx, next) {
      const { id } = ctx.state.user; //ctx.state.user contains the current authenticated user

      console.log('ctx.request.body', ctx.request.body);

      const response = await super.create(ctx);
      return await strapi.entityService
        .update('api::journal-entry.journal-entry', response.data.id, { data: { author: id } });
    },

    async update(ctx, next) {
      const { id } = ctx.state.user;
      const { id: taskId } = ctx.params;
      const response = await super.update(ctx);
      return await strapi.entityService
        .update('api::journal-entry.journal-entry', taskId, { data: { author: id } });
    },

    async delete(ctx, next) {
      const { id } = ctx.state.user;
      const { id: taskId } = ctx.params;
      const response = await super.delete(ctx);
      return await strapi.entityService
        .delete('api::journal-entry.journal-entry', taskId, { data: { author: id } });
    },

    async findOne(ctx, next) {
      const { id } = ctx.state.user;
      const { id: taskId } = ctx.params;
      const response = await super.findOne(ctx);
      return await strapi.entityService
        .findOne('api::journal-entry.journal-entry', taskId, { data: { author: id } });
    },
  }
})
