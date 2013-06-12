
  var Address = Backbone.Model.extend({
    defaults: {
      "name": ""
    },
    initialize: function() {
      console.log("Address[" + this.cid + "]: " + JSON.stringify(this));
    }
  });

  var AddressList = Backbone.Collection.extend({
    model: Address,
    localStorage: new Backbone.LocalStorage("address")
  });

  var addresses = new AddressList();

  var AddressView = Backbone.View.extend({
    tagName: "tr",
    template: _.template($('#addressTemplate').html()),
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  var AppView = Backbone.View.extend({
    el: $("#app"),
    initialize: function() {
      this.registView = this.$('#registView');
      this.inputName = this.$('#name');
      this.listenTo(addresses, 'add', this.addOne);
//      this.listenTo(addresses, 'all', this.addAll);
      addresses.fetch();
    },
    events: {
      "click #showRegist": "showRegistView",
      "click #registButton": "addAddress",
    },
    showRegistView: function() {
      console.log('registView');
      this.registView.show();
      this.inputName.vale('');
    },
    addAddress: function() {
      console.log('addAddress');
      addresses.create({name: this.inputName.val()});
      this.registView.hide();
      return false;
    },
    addOne: function(address) {
      var v = new AddressView({model: address});
      this.$('#addressListCon').append(v.render().el);
      console.log('addOne');
    }, 
    addAll: function() {
      console.log('addAll');
      addresses.each(this.addOne, this);
    }
  });

jQuery(document).ready(function() {

  var app = new AppView();
});
