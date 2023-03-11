import React from "react";
import { t, jt } from "ttag";
import LogoIcon from "metabase/components/LogoIcon";
import { MetabaseLink, MetabaseName, Message } from "./LogoBadge.styled";

function LogoBadge({ dark }: { dark: boolean }) {
  const Metabase = (
    <MetabaseName key="metabase" isDark={dark}>
      {t`Taric`}
    </MetabaseName>
  );
  return (
    <MetabaseLink href="https://ciusji.gitbook.io/taric/" target="_blank">
      <LogoIcon height={28} dark={dark} />
      <Message>{jt`Powered by ${Metabase}`}</Message>
    </MetabaseLink>
  );
}

export default LogoBadge;
