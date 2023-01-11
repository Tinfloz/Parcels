import React, { FC } from 'react';

interface IFooterProps {
    userType: string
}

const Footer: FC<IFooterProps> = ({ userType }) => {
    return (
        <>
            {
                userType === "Customer" ? (
                    <>
                    </>
                ) : (
                    <>
                        {
                            userType === "Chef" ? (
                                <>
                                </>
                            ) : (
                                <>
                                </>
                            )
                        }
                    </>
                )
            }
        </>
    )
}

export default Footer