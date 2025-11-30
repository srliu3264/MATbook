<div class="MATbook-admonish">
{% set class_title = class | title %}
{% if description %}
{% set header = "**" ~ class_title ~ " " ~ nth ~ "** (" ~ description ~ ")**.** " %}
{% else %}
{% set header = "**" ~ class_title ~ " " ~ nth ~ ".** " %}
{% endif %}
{% if body is starting_with("*") %}
{{ header | markdown }}
{{ body | markdown }}
{% elif body is starting_with("-") %}
{{ header | markdown }}
{{ body | markdown }}
{% elif body is starting_with("1.") %}
{{ header | markdown }}
{{ body | markdown }}
{% else %}
{{ header ~ body | markdown }}
{% endif %}
</div>
