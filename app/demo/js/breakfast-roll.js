(function() {
  var BreakfastRoll = {};
  window.BreakfastRoll = BreakfastRoll;

  var template = function(name) {
    return Mustache.compile($('#'+name+'-template').html());
  };

  BreakfastRoll.Recipe = Backbone.Model.extend({
  });

  BreakfastRoll.Recipes = Backbone.Collection.extend({
    localStorage: new Store("recipes")
  });

  BreakfastRoll.Index = Backbone.View.extend({
    template: template('index'),
    initialize: function() {
      this.recipes = new BreakfastRoll.Recipes();
      this.recipes.on('all', this.render, this);
      this.recipes.fetch();
    },
    render: function() {
      this.$el.html(this.template(this));
      var form = new BreakfastRoll.Index.Form();
      this.$(".recipes").append(form.render().el);
      return this;
    },
    count: function() {
      return this.recipes.length;
    }
  });

  BreakfastRoll.Index.Form = Backbone.View.extend({
    template: template('form'),
    initialize: function() {
      this.recipe = new BreakfastRoll.Recipe();
      //this.recipe.on('all', this.render, this);
      //this.recipes.fetch();
    },
    render: function() {
      this.$el.html(this.template(this));
      return this;
    }
  });

  /*
   * To do:
   *
   * * BreakfastRoll.Index.Form
   *   A view that renders a form which can be submitted
   *   to create a new recipe
   * * BreakfastRoll.Index should add a subview for each
   *   recipe in the database
   * * BreakfastRoll.Recipe
   *   A view that renders an individual recipe
   *   Also, a delete button to remove it
   */

  BreakfastRoll.Router = Backbone.Router.extend({
    initialize: function(options) {
      this.el = options.el
    },
    routes: {
      "": "index"
    },
    index: function() {
      var view = new BreakfastRoll.Index();
      this.el.empty();
      this.el.append(view.render().el);
    }
  });

  BreakfastRoll.boot = function(container) {
    container = $(container);
    var router = new BreakfastRoll.Router({el: container})
    Backbone.history.start();
  }
})()
