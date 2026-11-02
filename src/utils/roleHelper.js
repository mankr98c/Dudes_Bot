/**
 * Helper utility to find or auto-create roles for THE DUDES server
 */

async function findRole(guild, roleConf) {
  try {
    await guild.roles.fetch();
  } catch (err) {
    console.warn('[ROLE FETCH WARN] Could not refresh guild roles cache:', err.message);
  }

  // 1. Check by ID if explicitly provided in .env
  if (roleConf.id) {
    const roleById = guild.roles.cache.get(roleConf.id);
    if (roleById) return roleById;
  }

  // 2. Check by exact name match (case-insensitive)
  const exact = guild.roles.cache.find(
    r => r.name.toLowerCase() === roleConf.name.toLowerCase()
  );
  if (exact) return exact;

  // 3. Check by aliases or partial match
  if (Array.isArray(roleConf.aliases)) {
    for (const alias of roleConf.aliases) {
      const match = guild.roles.cache.find(
        r =>
          r.name.toLowerCase() === alias.toLowerCase() ||
          r.name.toLowerCase().includes(alias.toLowerCase())
      );
      if (match) return match;
    }
  }

  return null;
}

async function getOrCreateRole(guild, roleKey, roleConf) {
  let role = await findRole(guild, roleConf);
  if (role) return role;

  // If role is missing, automatically create it!
  try {
    role = await guild.roles.create({
      name: roleConf.name,
      color: roleConf.color || 0x5865F2,
      mentionable: true,
      reason: 'Auto-created by THE DUDES Bot for self-role picker'
    });
    console.log(`[ROLE AUTO-CREATED] Created role "${role.name}" (${role.id}) in ${guild.name}`);
    return role;
  } catch (err) {
    console.error(`[ROLE CREATE ERROR] Failed to auto-create role "${roleConf.name}":`, err.message);
    return null;
  }
}

module.exports = {
  findRole,
  getOrCreateRole
};
