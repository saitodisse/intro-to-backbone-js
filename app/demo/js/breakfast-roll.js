(function() {
  var BreakfastRoll = {};
  window.BreakfastRoll = BreakfastRoll;

  var template = function(name) {
    return Mustache.compile($('#'+name+'-template').html());
  };

  BreakfastRoll.Recipe = Backbone.Model.extend({
      name: function(){ return this.get("name") }
    , ingredients: function(){ return this.get("ingredients") }
  });

  BreakfastRoll.Recipes = Backbone.Collection.extend({
      model: BreakfastRoll.Recipe
    , localStorage: new Store("recipes")
  });

  BreakfastRoll.Index = Backbone.View.extend({
      template: template('index')
    , initialize: function() {
        this.recipes = new BreakfastRoll.Recipes();
        this.recipes.on('all', this.render, this);
        
        //debug: its called a lot of time when adding something listening to 'all' events
        //this.recipes.on('all', function(){console.log(arguments);}, this);
        
        this.recipes.fetch();
      }
    , render: function() {
        this.$el.html(this.template(this));
        
        var recipesFormView = new BreakfastRoll.Index.Form({ collection: this.recipes });
        var recipesView = new BreakfastRoll.Index.Recipes({ collection: this.recipes });
        
        this.$(".recipes").append(recipesView.render().el);
        this.$(".recipes").append(recipesFormView.render().el);
        
        return this;
      }
    , count: function() {
      return this.recipes.length;
    }
  });

  BreakfastRoll.Index.Form = Backbone.View.extend({
      template: template('index-form')
    , tagName: "form"
    , className: "form"
    , render: function() {
        this.$el.html(this.template(this));
        return this;
      }
    , events:{
        "submit": "submit"
      }
    , submit: function(event){
        event.preventDefault();
        this.collection.create({
            name: this.$('#name').val()
          , ingredients: this.$('#ingredients').val()
        })
      }
  });

  BreakfastRoll.Index.Recipes = Backbone.View.extend({
      tagName: "ul"
    , render: function() {
        this.collection.each(function(recipe){
          var view = new BreakfastRoll.Index.Recipe({model: recipe});
          this.$el.append(view.render().el);
        }, this);
        return this;
      }
  });

  BreakfastRoll.Index.Recipe = Backbone.View.extend({
      events:{
        "click button": "delete"
      }
    , template: template('recipe')
    , tagName: "li"
    , render: function() {
        this.$el.html(this.template(this.model));
        return this; 
      }
    , delete: function(){
        this.model.destroy();
      }
  });

  /*
   * To do:
   *   Also, a delete button to remove it
   */

  BreakfastRoll.Router = Backbone.Router.extend({
      initialize: function(options) {
        this.el = options.el
      }
    , routes: {
        "": "index"
      }
    , index: function() {
        var view = new BreakfastRoll.Index();
        this.el.empty();
        this.el.append(view.render().el);
      }
  });

  BreakfastRoll.boot = function(container) {
    var router;

    container = $(container);
    router = new BreakfastRoll.Router({el: container})
    Backbone.history.start();
  }
})()
