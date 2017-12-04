angular.module("ui.tinymce",[]).value("uiTinymceConfig",{}).directive("uiTinymce",["$rootScope","$compile","$timeout","$window","$sce","uiTinymceConfig",function(a,b,c,d,e,f){f=f||{};var g=0,h="ui-tinymce";return f.baseUrl&&(tinymce.baseURL=f.baseUrl),{require:["ngModel","^?form"],priority:599,link:function(i,j,k,l){function m(a){a?(n(),p&&p.getBody().setAttribute("contenteditable",!1)):(n(),p&&!p.settings.readonly&&p.getBody().setAttribute("contenteditable",!0))}function n(){p||(p=tinymce.get(k.id))}if(d.tinymce){var o,p,q=l[0],r=l[1]||null,s={debounce:!0},t=function(b){var c=b.getContent({format:s.format}).trim();c=e.trustAsHtml(c),q.$setViewValue(c),a.$$phase||i.$digest()};k.$set("id",h+"-"+g++),o={},angular.extend(o,i.$eval(k.uiTinymce));var u=function(a){var b;return function(d){c.cancel(b),b=c(function(){return function(a){a.isDirty()&&(a.save(),t(a))}(d)},a)}}(400),v={setup:function(b){b.on("init",function(){q.$render(),q.$setPristine(),q.$setUntouched(),r&&r.$setPristine()}),b.on("ExecCommand change NodeChange ObjectResized",function(){return s.debounce?void u(b):(b.save(),void t(b))}),b.on("blur",function(){j[0].blur(),q.$setTouched(),a.$$phase||i.$digest()}),b.on("remove",function(){j.remove()}),f.setup&&f.setup(b,{updateView:t}),o.setup&&o.setup(b,{updateView:t})},format:o.format||"html",selector:"#"+k.id};angular.extend(s,f,o,v),c(function(){s.baseURL&&(tinymce.baseURL=s.baseURL),tinymce.init(s),m(i.$eval(k.ngDisabled))}),q.$formatters.unshift(function(a){return a?e.trustAsHtml(a):""}),q.$parsers.unshift(function(a){return a?e.getTrustedHtml(a):""}),q.$render=function(){n();var a=q.$viewValue?e.getTrustedHtml(q.$viewValue):"";p&&p.getDoc()&&(p.setContent(a),p.fire("change"))},k.$observe("disabled",m),i.$on("$tinymce:refresh",function(a,c){var d=k.id;if(angular.isUndefined(c)||c===d){var e=j.parent(),f=j.clone();f.removeAttr("id"),f.removeAttr("style"),f.removeAttr("aria-hidden"),tinymce.execCommand("mceRemoveEditor",!1,d),e.append(b(f)(i))}}),i.$on("$destroy",function(){n(),p&&(p.remove(),p=null)})}}}}]);
 
var app = angular.module('word',['ui.tinymce']);
 
app.controller('mainController', function($scope){
     
    $scope.text = "";
    $scope.highlightAll = true;
    $scope.highlightAllEditor = true;
    $scope.stripParagraphs = false;
    $scope.removeLinks = false;
     
    $scope.tinymceOptions = {
        height: $('.editor-row .col').innerHeight() - 110,
        plugins: "code, paste",
        toolbar: "code",
        menubar: "",
        code_dialog_height: 200,
        forced_root_block : "", 
        force_br_newlines : true,
        force_p_newlines : false,
        cleanup: false,
        paste_preprocess: function(plugin, args) {
            //console.log('pre', args.content);
            if($scope.stripParagraphs) {
                args.content = args.content.replace(/<p>/g, '').replace(/<\/p>/g, '');
            } else {
                // don't strip paragraphs but get rid of lame &nbsp
                args.content = args.content.replace(/<p> <\/p>/g, '');
            }
             
            if($scope.removeLinks) {
                args.content = args.content.replace(/<\/?a(|\s+[^>]+)>/g, '');
            }
             
            //console.log('post', args.content);
       },
        paste_auto_cleanup_on_paste : true,
        paste_postprocess : function(pl, o) {
            // remove &nbsp
            o.node.innerHTML = o.node.innerHTML.replace(/&nbsp;/ig, " ");
        },
        setup: function(editor) {
            // on click select all
            editor.on('click', function(e) {
                if (!$scope.highlightAllEditor) return;
                console.log('target', e.target);
                editor.selection.select(e.target);
            });
            // clear btn
            $('.btn-clear').click(function(){
                $scope.$apply(function(){
                    $scope.text = '';
                });
            });
      },
      debounce: false
    }
     
    // highlight all if option is checked
    $('.output').click(function(){
        if (!$scope.highlightAll) return;
        $(this).select();
    });
     
    // instantiate new clipboard obj    
    var clipboard = new Clipboard('.btn-copy');
 
    clipboard.on('success', function(e) {
         $('.btn-copy').addClass('tooltipped tooltipped-s');
         
        setTimeout(function(){
            $('.btn-copy').removeClass('tooltipped tooltipped-s');
        }, 2000);
    });
 
});