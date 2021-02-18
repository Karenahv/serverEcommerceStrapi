'use strict';
const stripe = require('stripe')(
  'sk_test_51IK2TzDOXusZBt0IWiAdn3jdMHjnfxf8GxB1JYEfIeOAl6mFtSfbmLTQX5ihSzRFYU7toFGI9qCBILBg7uuACvVs00xWCza0UY'
)

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const {token, products, idUser, addressShiping} = ctx.request.body
    let totalPayment = 0
    for(let i=0; i < products.length; i++) {
      totalPayment = totalPayment + products[i][0].precio
    }

    const charge = await stripe.charges.create({
      amount: Math.round(totalPayment.toFixed(2)*100),
      currency: 'usd',
      source: token,
      description: `Id usuario: ${idUser}`
    })
    const createOrder = []

    for await (const product of products){
      console.log(products.length)
      console.log('pasó')
      const data = {
        game: product[0].id,
        users_permissions_user: idUser,
        totalPayment,
        idPayment: charge.id,
        addressShiping,
      }
      const validData = await strapi.entityValidator.validateEntityCreation(
        strapi.models.order,
        data
      )
      const entry = await strapi.query('order').create(validData)
      createOrder.push(entry)
    }
    return createOrder
  }
};
