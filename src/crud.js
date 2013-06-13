
  var Address = Backbone.Model.extend({
    defaults: {
      "name": "",
      "address": "",
      "done": false
    },
    initialize: function() {
      console.log("Address[" + this.cid + "]: " + JSON.stringify(this));
    },
    toggle: function() {
      this.save({done: !this.get("done")});
    }
  });

  var AddressList = Backbone.Collection.extend({
    model: Address,
    localStorage: new Backbone.LocalStorage("address"),
    done: function() {
      return this.filter(function(address) { return address.get('done')});
    }
  });

  var addresses = new AddressList();

  var AddressView = Backbone.View.extend({
    tagName: "tr",
    template: _.template($('#addressTemplate').html()),
    events: {
      "click .toggle": "toggleDone",
      "dblclick .view": "edit",
      "blur .edit": "close"
    },
    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    toggleDone: function() {
      console.log('toggleDone');
      this.model.toggle();
    },
    edit: function() {
      this.$el.addClass('editing');
      this.$('#name-' + this.model.id).focus();
    },
    close: function() {
      this.$el.removeClass('editing');
    }
  });

  var AppView = Backbone.View.extend({
    el: $("#app"),
    initialize: function() {
      this.registView = this.$('#registView');
      this.inputName = this.$('#name');
      this.inputAddress = this.$('#address');
      this.listenTo(addresses, 'add', this.addOne);
//      this.listenTo(addresses, 'all', this.addAll);
      addresses.fetch();
    },
    events: {
      "click #showRegist": "showRegistView",
      "click #registButton": "addAddress",
      "click #removeAddress": "removeAddress"
    },
    showRegistView: function() {
      console.log('registView');
      this.registView.show();
    },
    addAddress: function() {
      console.log('addAddress' + this.inputAddress.val());
      addresses.create({name: this.inputName.val(), address: this.inputAddress.val()});
      this.registView.hide();
      this.inputName.val('');
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
    },
    removeAddress: function() {
      console.log('removeAddress');
      _.invoke(addresses.done(), 'destroy');
    }
  });

jQuery(document).ready(function() {

  var app = new AppView();
});
