actor User {}

allow(actor, action, resource) if has_permission(actor, action, resource);
