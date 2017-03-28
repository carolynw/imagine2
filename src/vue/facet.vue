<li v-bind:class="{applied: isOptionApplied}">
    <a href="#" v-on:click.prevent="resetOption()">
        {{facet.title}}<span v-if="isOptionApplied">: {{appliedOption.title}}</span>
    </a>
    <ul>
        <li v-for="option in facet.options">
            <a href="/" v-on:click.prevent="setOption(option)">{{option.title}} ({{option.hits}})</a>
        </li>
    </ul>
</li>
