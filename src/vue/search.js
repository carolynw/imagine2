(function () {
    var facet = {
        props: ['facet'],
        template: vueTemplates['facet.vue'],
        methods: {
            resetOption: function () {
                this.facet.appliedOptionId = null;
            },
            setOption: function (option) {
                this.facet.appliedOptionId = option.id;
            }
        },
        computed: {
            isOptionApplied: function () {
                return this.facet.appliedOptionId !== null;
            },
            appliedOption: function () {
                var facet = this.facet;
                for (var i = 0; i < facet.options.length; i++) {
                    if (facet.options[i].id === facet.appliedOptionId) {
                        return facet.options[i];
                    }
                }
            }
        }
    };

    var facets = {
        props: ['facets', 'paging'],
        template: vueTemplates['facets.vue'],
        components: {
            'searchFacet': facet
        }
    };

    var paging = {
        props: ['paging'],
        template: vueTemplates['paging.vue'],
        components: {
            'paginate': VuejsPaginate
        },
        methods: {
            changePage: function (pageNumber) {
                this.paging.currentPage = pageNumber;
            }
        },
        computed:{
            rangeMin: function () {
                var paging = this.paging;
                return paging.perPage * (paging.currentPage - 1) + 1
            },
            rangeMax: function () {
                var paging = this.paging;
                var pagedMax = paging.perPage * paging.currentPage;
                return pagedMax < paging.hits ? pagedMax : paging.hits;
            }
        }
    };

    var results = {
        props: ['results'],
        template: vueTemplates['results.vue']
    };

    var vm = new Vue({
        el: '#search-page',
        components: {
            'searchResults': results,
            'searchFacets': facets,
            'searchPaging': paging
        },
        data: {
            facets: [],
            results: [],
            paging: {
                hits: 0,
                currentPage: 1,
                perPage: 10
            }
        },
        methods: {
            newSearch: function () {

            },
            refineSearch: function () {

            }
        }
    });

    var mockRequest = {
        searchTerms: 'whatever',
        skip: 20,
        take: 10,
        categoryId: 'productsGuid',
        facets: {
            facetGuid1: ['optionGuid1'],
            facetGuid3: ['optionGuid2']
        }
    };

    var mockResponse = {
        paging:{
            hits:33
        },
        results: [
            {
                title: 'Test 1',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor massa a ante ultricies, eu bibendum nulla laoreet. Aenean in ex eu elit aliquet mollis vitae id ex.',
                url: '/',
                actions: [
                    {title: 'Click me!', url: '#'},
                    {title: 'No, me!', url: '#'}
                ],
                tags: ['tag1', 'tag2', 'tag3']
            },
            {
                title: 'Test 2',
                description: null,
                url: '/',
                actions: null,
                tags: null
            },
            {
                title: 'Test 3',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor massa a ante ultricies, eu bibendum nulla laoreet. Aenean in ex eu elit aliquet mollis vitae id ex.',
                url: '/',
                actions: null,
                tags: ['tag6', 'tag7', 'tag8']
            }
        ],
        facets: [
            {
                id: 'facetGuid1',
                title: 'facet 1',
                appliedOptionId: 'optionguid2',
                options: [
                    {
                        id: 'optionguid1',
                        title: 'Category 1',
                        hits: 11
                    },
                    {
                        id: 'optionguid2',
                        title: 'Category 2',
                        hits: 22
                    },
                    {
                        id: 'optionguid3',
                        title: 'Category 3',
                        hits: 33
                    }]
            },
            {
                id: 'facetGuid2',
                title: 'facet 2',
                appliedOptionId: null,
                options: [
                    {
                        id: 'optionguid4',
                        title: 'Category 4',
                        hits: 44
                    },
                    {
                        id: 'optionguid5',
                        title: 'Category 5',
                        hits: 55
                    }]
            },
            {
                id: 'facetGuid3',
                title: 'facet 3',
                appliedOptionId: null,
                options: [
                    {
                        id: 'optionguid6',
                        title: 'Category 6',
                        hits: 66
                    },
                    {
                        id: 'optionguid7',
                        title: 'Category 7',
                        hits: 77
                    }, {
                        id: 'optionguid8',
                        title: 'Category 8',
                        hits: 88
                    }]
            }
        ]
    };

    (function () {
        vm.results = mockResponse.results;
        vm.facets = mockResponse.facets;
        vm.paging.hits = mockResponse.paging.hits;
    }());
}());