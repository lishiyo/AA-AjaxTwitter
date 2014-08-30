* FollowToggle
    * just change partial, applies everywhere!
    * handleClick/render
    * initial-follow-state, user-id data attributes
* UsersSearch
    * I expected a div, inserted input and ul tags.
    * Held an array of results
    * On "input" to the input tag, made ajax query, updated results.
    * Wrote renderResults method.
    * This built li and anchor tag.
    * Modified FollowToggle to take options; built even that.
    * Avoid underscore until the very end?
* TweetCompose
    * Decreasing counter of chars left (use input event).
    * AJAX submit (obviously)
    * Provide linked ul of tweets; insert on success.
    * Clear for reuse!
* TweetCompose II
    * Add mentioned-users div.
    * Put a script template in there. We'll write straight HTML.
    * Template should have select tag, plus a remove button. Put this
      in a span.
    * Have an "add new mention" link.
    * At start of TweetCompose, grab script template and compile.
    * Each time clicking the add new mention, clone template and insert.
    * Each time clicking remove link, remove the select/remove button.
