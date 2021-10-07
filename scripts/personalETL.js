const PersonalETL = 
    Object.create(null,{
        
        "load": {
            value: function() {},
            writable: true,
            enumerable: true
        },

        "data": {
            value: [],
            writable: true,
            enumerable: true
        },
        
        // initially set the filterd data = data
        "filteredData": {
            value: this.data,
            writable: true,
            enumerable: true
        },

        // this is a function created by the concrete implementation
        "filterBySearchCriteria": {
            value: {},
            writable: true,
            enumerable: true
        },

        // this may change as the implementation changes
        "filterByTag": {
            writable: true,
            value: function(tag) {
            // Get records with matching tags
                const matchedRecords = [];
                this.data.forEach(record => {
                    record.tags.forEach(currentTag =>{
                        if (currentTag === tag) 
                            matchedRecords.push(record);
                        return;
                    });
                });
                this.filteredData = matchedRecords;
                this.paginate();
                this.display(1);
            }
        },

            
        /**
         * The paginationObj contains the object that controls the pagination
         */
        "paginationObj": {
            value: {},
            writable: true,
            enumerable: true
        },
        
        /**
         * The display property will contain a function that controls
         * How the object displays it's data
         * This is specific to how the object is acutally implemented
         */
        "display": {
            value: {},
            writable: true,
            enumerable: true
        },

        "displayOptions": {
            value: {
                "itemsPerPage": 5,
            },
            writable: true,
            enumerable: true
        },

        "search": {
            value: function(searchString) {
                if (searchString.length >=3) {
                    this.filterBySearchCriteria(searchString);
                } else {
                    this.filterBySearchCriteria("");
                }
            },
            writable: true,
            enumerable: true
        },
    
        "paginate": {
            // takes a callback function from the pagination object
            value: function() {
                
                const numberOfItems = this.filteredData.length;
                const numberOfPages = Math.ceil(numberOfItems / this.displayOptions.itemsPerPage);
                
                this.Paginator.init(numberOfPages,1);
                
                if (!$.isEmptyObject(this.paginationObj)) {
                    //determine how to handle the pagination display
                    // if (numberOfPages > 1) {
                    //     document.querySelector(".pagination").style.visibility = "";
                    // } else {
                    //     document.querySelector(".pagination").style.visibility = "hidden";
                    // }
                }
            },
            writable: true,
            enumerable: true
        },
    




    });


module.exports = PersonalETL;