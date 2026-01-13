import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function MembersTab({
  owner,
  members,
  currentUser,
  isOwner,
  newMemberName,
  onNewMemberNameChange,
  onAddMember,
  onRemoveMember,
  onLeaveList,
  onTransferOwnership,
}) {
  const { t } = useTranslation();
  const [selectedMemberId, setSelectedMemberId] = useState("");

  useEffect(() => {
    const firstId = members[0]?.id ?? "";
    setSelectedMemberId(firstId);
  }, [members]);

  const isMember = members.some((m) => m.id === currentUser.id);

  const handleTransferClick = () => {
    if (!selectedMemberId) return;
    onTransferOwnership(Number(selectedMemberId));
  };

  return (
    <div>
      <h2>{t("members.title")}</h2>

      <p>
        <strong>{t("members.owner")}:</strong> {owner.name}
      </p>

      <p>
        <strong>{t("members.members")}:</strong>
      </p>

      {members.length === 0 ? (
        <p>{t("members.noMembers")}</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {members.map((member) => (
            <li
              key={member.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              {isOwner && (
                <button onClick={() => onRemoveMember(member.id)}>{t("members.remove")}</button>
              )}
              <span>• {member.name}</span>
            </li>
          ))}
        </ul>
      )}

      {isOwner && (
        <div style={{ marginTop: 16 }}>
          <p style={{ marginBottom: 4 }}>{t("members.addMember")}:</p>
          <input
            type="text"
            placeholder={t("members.newMemberPlaceholder")}
            value={newMemberName}
            onChange={(e) => onNewMemberNameChange(e.target.value)}
          />
          <button onClick={() => onAddMember()}>{t("members.addMemberButton")}</button>
        </div>
      )}

      {isOwner && members.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <p style={{ marginBottom: 4 }}>{t("members.transferOwnership")}:</p>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
          >
            <option value="">{t("members.selectMember")}</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          <button onClick={handleTransferClick} style={{ marginLeft: 8 }}>
            {t("members.transferOwnership")}
          </button>
        </div>
      )}

      {/* Tlačítko Odejít – pouze pro běžného člena (není vlastník) */}
      {!isOwner && isMember && (
        <div style={{ marginTop: 20 }}>
          <button onClick={onLeaveList}>{t("members.leaveList")}</button>
        </div>
      )}
    </div>
  );
}

export default MembersTab;
