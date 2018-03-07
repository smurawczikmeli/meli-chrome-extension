var s = document.createElement("script")
s.appendChild(document.createTextNode(`
    eval(\`
        var childCategories = [];
        function addXMLRequestCallback(callback){
            var oldSend, i;
            if( XMLHttpRequest.callbacks ) {
                XMLHttpRequest.callbacks.push( callback );
            } else {
                XMLHttpRequest.callbacks = [callback];
                oldSend = XMLHttpRequest.prototype.send;
                XMLHttpRequest.prototype.send = function () {
                    for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                        XMLHttpRequest.callbacks[i]( this );
                    }
                    oldSend.apply(this, arguments);
                }
            }
        }

        addXMLRequestCallback( function( xhr ) {

        });

        addXMLRequestCallback( function( xhr ) {
            setTimeout(() => {
                var resp = JSON.parse(xhr.response);
                var catID = resp.request.data.data['list-0.item.category_id'];
                var colLength = resp.response.data.steps.category_selection.components.item_classification_id.instances[0].data.columns.length
                var isLeaf = resp.response.data.steps.category_selection.components.item_classification_id.instances[0].data.columns[colLength - 1].is_leaf;
                var breadCrumbColLength = resp.response.data.steps.category_selection.components.breadcrumb.instances[0].data.categories.length
                var breadCrumbName = "";
                resp.response.data.steps.category_selection.components.breadcrumb.instances[0].data.categories.forEach((cat, index) => {
                   breadCrumbName += cat.name + (index < breadCrumbColLength - 1 ? " > " : "");
                });
                if (isLeaf) {
                childCategories.push({
                    id: catID,
                    name: breadCrumbName
                })
                }
                // console.warn( JSON.parse(xhr.response) );
            }, 1000);
        });
    \`)`));
document.body.appendChild(s)