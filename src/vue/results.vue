<div class="results">
    <ul class="list">
        <li v-for="result in results">
            <div class="left">

            </div>
            <div class="right">
                <p class="title">{{result.title}}</p>
                <ul class="categories">
                    <li v-for="category in result.categories">
                        {{category.title}}


                    </li>
                </ul>
                <p class="desc">
                    {{result.description}}
                </p>
                <ul class="calls-to-action" v-if="result.actions">
                    <li v-for="action in result.actions">
                        <a :href="action.url">{{action.title}}</a>
                    </li>
                </ul>
                <ul class="tags" v-if="result.tags">
                    <li v-for="tag in result.tags">
                        {{tag}}


                    </li>
                </ul>
            </div>
        </li>
    </ul>
</div>