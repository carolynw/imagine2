(function () {
    Vue.component("paginate", VuejsPaginate);

    var results = {
        props: ["results"],
        template: vueTemplates["results.vue"]
    };

    var facets = {
        props: ["facets", "paging"],
        template: vueTemplates["facets.vue"],
        methods: {
            setFacet: function (facet, category) {
                facet.isApplied = true;
                facet.applied = category;
            },
            resetFacet: function (facet) {
                facet.isApplied = false;
            }
        }
    };

    var paging = {
        props: ["paging"],
        template: vueTemplates["paging.vue"],
        methods: {
            changePage: function (pageNumber) {
                var self = this;
                self.paging.currentPage = pageNumber;
            }
        }
    };

    var vm = new Vue({
        el: "#search-page",
        components: {
            "searchResults": results,
            "searchFacets": facets,
            "searchPaging": paging
        },
        data: {
            facets: {},
            results: [],
            paging: []
        }
    });

    vm.paging = {
        hits: 123456,
        currentPage: 1,
        perPage: 10,
        pageCount: 16
    };

    // Mock data
    vm.results = [
        {
            id: 1,
            title: "Test 1",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor massa a ante ultricies, eu bibendum nulla laoreet. Aenean in ex eu elit aliquet mollis vitae id ex.",
            actions: [
                {title: "Click me!", url: "#"},
                {title: "No, me!", url: "#"}
            ],
            tags: ["tag1", "tag2", "tag3"]
        },
        {
            id: 2,
            title: "Test 2",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor massa a ante ultricies, eu bibendum nulla laoreet. Aenean in ex eu elit aliquet mollis vitae id ex.",
            actions: null,
            tags: null
        },
        {
            id: 3,
            title: "Test 3",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor massa a ante ultricies, eu bibendum nulla laoreet. Aenean in ex eu elit aliquet mollis vitae id ex.",
            actions: null,
            tags: ["tag6", "tag7", "tag8"]
        }
    ];

    vm.facets = [
        {
            id: 1,
            title: "facet 1",
            isApplied: false,
            applied: null,
            categories: [
                {
                    id: 1, title: "Category 1",
                    hits: 11
                },
                {
                    id: 2, title: "Category 2",
                    hits: 22
                },
                {
                    id: 3,
                    title: "Category 3",
                    hits: 33
                }]
        },
        {
            id: 2,
            title: "facet 2",
            isApplied: false,
            applied: null,
            categories: [
                {
                    id: 4,
                    title: "Category 4", hits: 44
                },
                {
                    id: 5,
                    title: "Category 5", hits: 55
                }]
        },
        {
            id: 3,
            title: "facet 3",
            isApplied: false,
            applied: null,
            categories: [
                {
                    id: 6, title: "Category 6",
                    hits: 66
                },
                {
                    id: 7, title: "Category 7",
                    hits: 77
                }, {
                    id: 8,
                    title: "Category 8",
                    hits: 88
                }]
        }
    ]
}());