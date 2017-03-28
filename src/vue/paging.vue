<div class="paging">
    <paginate
            :page-count="20"
            :initial-page="paging.currentPage"
            :margin-pages="0"
            :page-range="5"
            :click-handler="changePage"
            :prev-text="'Prev'"
            :next-text="'Next'"
            :container-class="'paging'">
    </paginate>

    <div>
        Showing {{paging.perPage * (paging.currentPage - 1) + 1}} - {{paging.perPage * paging.currentPage}}
        of {{paging.hits}} results
    </div>
</div>