import React from 'react'
import { Menu } from 'antd'
import styled from 'styled-components'

const { SubMenu } = Menu

const SubMenuCustom = styled(SubMenu)`
  :hover {
    border-bottom: none;
  }
`

const IconMenu = styled.img`
  margin: 0 0.65rem 0 0;
`

const KoyweSubMenu = ({ path, handleMenu }) => {
  return (
    <Menu className="menu" mode="horizontal" disabledOverflow defaultSelectedKeys={[path]}>
      <SubMenuCustom
        className="menu-item"
        key="SubMenu"
        icon={<IconMenu src="/icon/menu.svg" width={32} />}
        popupClassName="submenu"
      >
        <Menu.Item
          key="/pledge"
          icon={<IconMenu src="/icon/pledge.svg" width={24} />}
          onClick={() => handleMenu('/pledge')}
        >
          Koywe pledge
        </Menu.Item>
        <Menu.Item
          key="setting:2"
          icon={<IconMenu src="/icon/emissionsCalculator.svg" width={24} />}
          onClick={() => handleMenu('/emission')}
        >
          Emissions Calculator
        </Menu.Item>
        <Menu.Item
          key="setting:3"
          icon={<IconMenu src="/icon/ranking.svg" width={24} />}
          onClick={() => handleMenu('/ranking')}
        >
          Ranking
        </Menu.Item>
        <Menu.Item
          key="setting:4"
          icon={<IconMenu src="/icon/arrow-down.svg" width={24} />}
          onClick={() => handleMenu('/offsets')}
        >
          Offsets (beta)
        </Menu.Item>
        {/* <Menu.Item key="setting:5" icon={<IconMenu src="/icon/docs.svg" width={24} />}>
          Docs
        </Menu.Item>
        <Menu.Item key="setting:6" icon={<IconMenu src="/icon/mintPosition.svg" width={24} />}>
          Mint Position NFT
        </Menu.Item> */}
      </SubMenuCustom>
    </Menu>
  )
}

export default KoyweSubMenu
