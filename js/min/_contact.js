function setElement(){var a;switch(breadcrumbs(),window.step){case 1:a=$("#name"),window.history.replaceState(history.state,"Step 1",window.location.pathname+"?step=1"),step1();break;case 2:a=$("#project"),step2();break;case 3:a=$("#details"),step3();break;case 4:a=$("#review"),step4()}a.show();var b=a.children(".edit");return setTimeout(function(){b.focus()},100),0==b.length&&(b=a.find(".edit")),window.element={parent:a,child:b}}function initialization(){return null==$.urlParam("step")?window.step=1:window.step=parseInt($.urlParam("step")),$("section").hide(),setElement()}function step1(){null!==sessionStorage.getItem("name")?$("#name .edit").text(sessionStorage.getItem("name")):$("#name .edit").html("&nbsp;").addClass("empty")}function step2(){$("#return-name").text(sessionStorage.getItem("name")),null!==sessionStorage.getItem("project")?$("#project .edit").html(sessionStorage.getItem("project")):$("#project .edit").html("&nbsp;").addClass("empty"),$(document).on("keyup","#project .edit",function(){$("#project .edit").find("*").removeAttr("style")})}function step3(){var a=["phone","email"],b=[];$.each(a,function(a,c){null!==sessionStorage.getItem(c)&&($("#"+c).text(sessionStorage.getItem(c)),$.trim(sessionStorage.getItem(c)).length>0&&$("#"+c).siblings(".label").hide()),b[c]=$.trim($("#"+c).text()).length}),0==b.phone&&0==b.email?$("#email, #phone").addClass("empty"):setTimeout(function(){var a=jQuery.Event("keydown");a.which=a.keyCode=40,$("#email, #phone").trigger(a)},1),$(document).on("keypress","#email, #phone",function(a){setTimeout(function(){$.trim($(a.target).text()).length>0?$(a.target).siblings(".label").hide():$(a.target).siblings(".label").show()},1)}).on("keydown","#email, #phone",function(a){setTimeout(function(){$.trim($(a.target).text()).length>0?($(a.target).siblings(".label").hide(),dummyWidth($(a.target))):$(a.target).siblings(".label").show(),$.trim($("#email, #phone").text()).length<4&&$("#email, #phone").addClass("empty"),$.trim($("#email, #phone").text()).length>6&&(validateContact()||($(".email .error").remove(),$("#phone").removeClass("empty")))},1)}).on("focus","#email, #phone",function(a){0==$.trim($(a.target).text()).length&&$(a.target).html("&nbsp;")})}function step4(){var a=["name","project","email","phone"],b={};$.each(a,function(a,c){null!==sessionStorage.getItem(c)&&$("#review-"+c).children(".result").html(sessionStorage.getItem(c)),0==$.trim($("#review-"+c).text()).length&&$("#review-"+c).remove(),b[c]=sessionStorage.getItem(c)}),$("#send").on("click",function(){b.action="send_email",$("#send").removeClass("default").addClass("sending").text("Sending"),$.post(ajaxurl,b,function(a){$("#send").removeClass("sending").addClass("sent").text("Message sent")})})}function validateContact(){var a=!1;return $.trim($("#email").text()).length>0&&null==$.trim($("#email").text()).match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/i)&&(a="email"),$.trim($("#phone").text()).length>0&&null==$.trim($("#phone").text()).match(/^\+*?[\d\/\\\-\s\(\)]*?$/)&&(a="phone"),a}function nextStep(){return 1==window.element.child.length&&0==window.element.child.text().length?!1:(2==step?sessionStorage.setItem($(window.element.child).data("key"),$(window.element.child).html()):$.each(window.element.child,function(a,b){sessionStorage.setItem($(b).data("key"),$.trim($(b).text()))}),window.element.parent.hide(),window.step++,window.history.pushState(history.state,"Step "+window.step,window.location.pathname+"?step="+window.step),void(window.element=setElement()))}function errorHandler(a){$(window.element.parent).find(".error").length>0&&$(window.element.parent).find(".error").remove();var b=$("<span>").addClass("error");switch($(window.element.child[0]).after(b),a){case"empty":switch(window.element.parent[0].id){case"name":b.text(contactLocalization.nameEmpty);break;case"project":b.text(contactLocalization.projectEmpty);break;case"details":b.text(contactLocalization.contactEmpty)}break;case"email":case"details":b.text(contactLocalization.emailInvalid);break;case"phone":case"details":b.text(contactLocalization.phoneInvalid)}}function breadcrumbs(){switch(window.step){case 1:$(".bcb-first").addClass("active"),$(".bcb-second").addClass("inactive"),$(".bcb-third").addClass("inactive"),$(".bcb-fourth").addClass("inactive");break;case 2:$(".bcb-first").addClass("done").removeClass("active"),$(".bcb-second").addClass("active").removeClass("inactive"),$(".bcb-third").addClass("inactive"),$(".bcb-fourth").addClass("inactive");break;case 3:$(".bcb-first").addClass("done"),$(".bcb-second").addClass("done").removeClass("active"),$(".bcb-third").addClass("active").removeClass("inactive"),$(".bcb-fourth").addClass("inactive");break;case 4:$(".bcb-first").addClass("done"),$(".bcb-second").addClass("done"),$(".bcb-third").addClass("done").removeClass("active"),$(".bcb-fourth").addClass("active").removeClass("inactive")}}function dummyWidth(a){var b=a.siblings(".width-dummy");if(b.text($.trim(a.text())),b.width()>=a.width())for(var c=parseInt(a.css("font-size"));b.width()>=a.width();)c-=1,a.css("font-size",c+"px"),b.css("font-size",c+"px")}$(document).ready(function(){window.element=initialization(),$(document).on("keypress",".edit",function(a){if(13==a.which){if(2==window.step)return;if(a.preventDefault(),3==window.step&&validateContact())return errorHandler(validateContact()),!1;$(a.target).hasClass("empty")?errorHandler("empty"):nextStep()}}),$(document).on("click",".edit",function(a){if($(a.target).outerWidth()+$(a.target).offset().left<a.clientX){if(3==window.step&&validateContact())return errorHandler(validateContact()),!1;$(a.target).hasClass("empty")?errorHandler("empty"):nextStep()}}),$(document).on("keydown",".edit",function(a){setTimeout(function(){window.step<3&&($.trim($(a.target).text()).length>3?$(a.target).removeClass("empty"):$(a.target).addClass("empty")),(8==a.which||46==a.which)&&0==$.trim($(a.target).text()).length&&$(a.target).html("&nbsp;")},1)}),$(document).on("focus",".edit",function(a){var b,c=$(a.target).text().length;if(document.selection)b=document.selection.createRange(),b.moveStart("character",c),b.select();else{b=window.getSelection();for(var d=a.target;null!==d.lastChild;)d=d.lastChild;c=$.trim(d.textContent).length,b.collapse(d,c)}}),$(document).on("click",".bcb.done",function(){window.location.href="?step="+$(this).children(".step").data("step")}),$(document).on("click",".bcb.active",function(){var a=$(this).attr("id").split("-");$("#"+a[1]).find(".edit").focus()})}),$(window).on("popstate",function(a){$(".bcb").removeClass("done").removeClass("active").removeClass("inactive"),window.element=initialization()});