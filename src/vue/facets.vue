<div class="facets">
    <div>Refine <span>{{paging.hits}} results</span></div>
    <ul class="list">
        <search-facet v-for="facet in facets" :facet="facet" :key="facet.id"></search-facet>
    </ul>
</div>