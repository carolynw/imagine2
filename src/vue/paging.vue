<div class="paging" v-if="paging.hits > 0">
    <paginate
            :page-count="Math.ceil(paging.hits / paging.perPage)"
            :initial-page="paging.currentPage"
            :margin-pages="0"
            :page-range="5"
            :click-handler="changePage"
            :prev-text="'Prev'"
            :next-text="'Next'"
            :container-class="'paging'">
    </paginate>

    <div>
        Showing {{rangeMin}} - {{rangeMax}} of {{paging.hits}} results
    </div>
</div>