module.exports = (sequelize, DataTypes) => {
    return sequelize. define('test_users', {
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,      
        },
        score: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        timestamps: false,
    });
};