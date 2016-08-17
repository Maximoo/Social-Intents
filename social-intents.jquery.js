;(function ( $, window, document, undefined ) {

  "use strict";
    var pluginName = "SocialIntents",
      defaults = {
        width: 520,
        height: 350,
        url: window.location.href,
        tw_via: '',
        tw_hashtags: '',
        tw_i_urlshare: true,
        fb_appid: false
      },
      pluginAllow = ["tw_i","tw","fb","fb_s","pi","gp"];

    function Plugin( element, options ) {
        this.element = $(element);
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this._url = "";
        this.init();
    }

    $.extend(Plugin.prototype, {
        _fb_s_url: function(url, title){
          return 'http://www.facebook.com/sharer.php?s=100' + 
            '&p[title]=' + encodeURIComponent(title) +  
            '&p[url]=' + encodeURIComponent(url);
        },
        _fb_url: function(url){
          return 'https://www.facebook.com/dialog/share?app_id=' + this.settings.fb_appid + '&display=popup' + 
            '&href=' + encodeURIComponent(url);
        },
        _tw_url: function(url, title){
          return 'http://twitter.com/share' + 
            '?text=' + encodeURIComponent(title) + 
            '&url=' + encodeURIComponent(url) + 
            (this.settings.tw_via?
              '&via=' + encodeURIComponent(this.settings.tw_via):'');
        },
        _tw_i_url: function(url, text){
          return 'https://twitter.com/intent/tweet' +
            '?text=' + encodeURIComponent(text) + 
            (this.settings.tw_i_urlshare !== false ? 
              '&url=' + encodeURIComponent(url) : '') + 
            (this.settings.tw_hashtags ? 
              '&hashtags=' + encodeURIComponent(this.settings.tw_hashtags) : '') + 
            (this.settings.tw_via ? 
              '&via=' + encodeURIComponent(this.settings.tw_via) : '');
        },
        _pi_url: function(url, title, image){
          return 'https://es.pinterest.com/pin/create/button/' +
            '?url=' + encodeURIComponent(url) + 
            '&media=' + encodeURIComponent(image) + 
            '&description=' + encodeURIComponent(title);
        },
        _gp_url: function(url, title){
          return 'https://plus.google.com/share' +
            '?url=' + encodeURIComponent(url) +  
            '&h1=' + encodeURIComponent(title);
        },
        _window_open: function(){
          window.open(this._url, this._name, this._window_size(this.settings.width, this.settings.height));
        },
        _window_size: function(winWidth, winHeight){
          var winTop = (screen.height / 2) - (winWidth / 2),
              winLeft = (screen.width / 2) - (winHeight / 2);
          return 'top=' + winTop + ',left=' + winLeft + 
                 ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight;
        },
        init: function () {
          var social = this.element.data(this._name.toLowerCase()), $this = this;
          if(pluginAllow.indexOf(social) >= 0){
            if(social === "tw_i"){
              this.element.find("button, submit").click(function( event ){
                event.preventDefault();
                $this._url = $this["_" + social + "_url"]($this.settings.url, $this.element.find("input").val());
                $this._window_open();
              });
            } else {
              var href  = this.element.data("href") ? this.element.data("href") : this.element.attr("href"),
                  title = this.element.data("title") ? this.element.data("title") : this.element.attr("title"),
                  image = this.element.data("image") ? this.element.data("image") : $('meta[property="og:image"]').attr('content');
              this._url = this["_" + social + "_url"](href, title, image);  
              this.element.click(function( event ){
                event.preventDefault();
                $this._window_open();
              });
            }
          }
        }
    });

    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };

})( jQuery, window, document );